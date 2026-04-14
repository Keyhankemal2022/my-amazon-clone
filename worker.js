// Cloudflare Pages _worker.js - COMPLETE BACKEND
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve static files
    if (!url.pathname.startsWith('/api/')) {
      return fetch(request);
    }
    
    // API ROUTES
    if (request.method === 'POST') {
      const data = await request.json();
      
      // REGISTER
      if (url.pathname === '/api/register') {
        let users = await env.KV_USERS.get('users', {type: 'json'}) || [];
        if (users.find(u => u.email === data.email)) {
          return Response.json({error: 'Email exists'}, {status: 400});
        }
        data.password = btoa(data.password);
        data.id = Date.now() + '';
        users.push(data);
        await env.KV_USERS.put('users', JSON.stringify(users));
        return Response.json({success: true});
      }
      
      // LOGIN
      if (url.pathname === '/api/login') {
        let users = await env.KV_USERS.get('users', {type: 'json'}) || [];
        let user = users.find(u => u.email === data.email && u.password === btoa(data.password));
        
        // Admin check
        if (!user && data.email === 'admin' && data.password === btoa('admin')) {
          user = {id: 'admin', name: 'Admin', email: 'admin', isAdmin: true};
        }
        
        if (!user) {
          return Response.json({error: 'Wrong credentials'}, {status: 401});
        }
        
        const session = btoa(JSON.stringify({id: user.id, isAdmin: !!user.isAdmin}));
        const res = Response.json({success: true, redirect: user.isAdmin ? '/admin/dashboard.html' : '/dashboard.html'});
        res.headers.set('Set-Cookie', `session=${session}; Path=/; HttpOnly; Secure; SameSite=Strict`);
        return res;
      }
      
      // LOGOUT
      if (url.pathname === '/api/logout') {
        const res = Response.json({success: true});
        res.headers.set('Set-Cookie', 'session=; Path=/; Max-Age=0');
        return res;
      }
    }
    
    // GET STATS
    if (url.pathname === '/api/stats') {
      const cookie = request.headers.get('Cookie');
      if (!cookie?.includes('session=')) {
        return Response.json({error: 'Login required'}, {status: 401});
      }
      let users = await env.KV_USERS.get('users', {type: 'json'}) || [];
      return Response.json({
        totalUsers: users.length,
        activeUsers: Math.floor(users.length * 0.8)
      });
    }
    
    // GET USERS (Admin)
    if (url.pathname === '/api/users') {
      const cookie = request.headers.get('Cookie');
      if (!cookie?.includes('admin')) {
        return Response.json({error: 'Admin only'}, {status: 403});
      }
      let users = await env.KV_USERS.get('users', {type: 'json'}) || [];
      return Response.json(users);
    }
    
    return new Response('Not Found', {status: 404});
  }
};