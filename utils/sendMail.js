var mailer = require('nodeMailer')

import cfg from '../config'

var transporter = mailer.createTransport({
  service: cfg.mail.service,
  auth: {
    user: cfg.mail.user,
    pass: cfg.mail.pass
  }
});

export default async (infos) => {
  console.log('email debug config:', cfg.mail);
  // 发送邮件, 不可靠的请求
  return await transporter.sendMail({
    from: `${cfg.mail.name} <${cfg.mail.user}>`,
    to: infos.email,
    subject: '欢迎注册Wynfrith的问答社区',
    html: `
	<table border="0" cellspacing="0" cellpadding="0" width="100%" bgcolor="#f3f3f3" style="color:#4a4a4a;font-family:'Museo Sans Rounded',Museo Sans Rounded,'Museo Sans',Museo Sans,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;border-collapse:callapse;border-spacing:0;margin:0 auto">
		<tbody>
			<tr>
				<td style="padding-left:10px;padding-right:10px">
					<table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="width:100%;margin:0 auto;max-width:600px">
						<tbody>
							<tr>
								<td bgcolor="#ffffff" style="background-color:#ffffff;padding:9%">
									<table border="0" cellspacing="0" cellpadding="0" style="width:100%;padding-bottom:20px">
										<tbody>
											<tr>
												<td width="100%">
													<h1 style="font-size:18px;font-weight:700;color:#404040;line-height:24px;margin:0 0 15px 0">
														欢迎注册Wynfrith的问答社区
													</h1>
													<p style="color:#888;font-size:15px;font-weight:normal;line-height:24px;margin:0 0 15px 0">
														亲爱的 <strong> ${infos.receiver} </strong>:
													</p>
													<p style="color:#888;font-size:15px;font-weight:normal;line-height:24px;margin:0">
														您马上可以成为wynfrith问答社区中的一员， 点击下面按钮激活您的账号
													</p>
												</td>
											</tr>
										</tbody>
									</table>

									<table border="0" cellspacing="0" cellpadding="0" style="width:100%">
										<tbody>
											<tr>
												<td style="padding:10px 0" align="center">
													<table dir="ltr" border="0" cellspacing="0" cellpadding="0" style="line-height:22px;margin:0 auto;height:34px">
														<tbody>
															<tr>
																<td valign="middle" height="38" style="background-color:#4aba4f;font-size:14px">
																	<a style="color:#ffffff;font-weight:700;text-decoration:none;font-size:14px!important;padding: 10px" href="${cfg.mail.callbackUrl}?token=${infos.token}" target="_blank">点击这里激活账号</a>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
					</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
	`
  });
}


