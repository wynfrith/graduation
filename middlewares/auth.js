export default function auth() {
  return async (ctx, next) => {
    // 验证session
    if (/^\/admin/.test(ctx.path)) {
      if (ctx.session.user) {
        ctx.state.u = ctx.session.user;
      } else {
        ctx.state.u = '';
       return ctx.redirect('/');
      }
    } 
      
    await next();
  }
}