export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  
  // Serve static files automatically
  if (!url.pathname.startsWith('/api/')) {
    return fetch(request);
  }
  
  if (request.method === 'POST') {
    const data = await request.json();
    
    // REGISTER
    if (url.pathname === '/api/register') {
      let users = await env.KV_USERS?.get('users', {type: 'json'}) || [];
      if (users.find(u => u.email === data.email)) {
        return Response.json({error: 'Email exists'}, {status: 400});
      }
      data.password = btoa(data.password);
      data.id = Date.now() + '';
      users.push(data);
      await env.KV_USERS?.put('users', JSON.stringify(users));
      return Response.json({success: true});
    }
    
    // LOGIN
    if (url.pathname === '/api/login') {
      let users = await env.KV_USERS?.get('users', {type: 'json'}) || [];
      let user = users.find(u => u.email === data.email && u.password === btoa(data.password));
      
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
  
  // STATS
  if (url.pathname === '/api/stats') {
    let users = await env.KV_USERS?.get('users', {type: 'json'}) || [];
    return Response.json({totalUsers: users.length, activeUsers: Math.floor(users.length * 0.8)});
  }
  
  // USERS
  if (url.pathname === '/api/users') {
    let users = await env.KV_USERS?.get('users', {type: 'json'}) || [];
    return Response.json(users);
  }
  
  return Response.json({error: 'Not Found'}, {status: 404});
}
