


export function createTemplate(otp: string) {
    return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GiggleCart</title>
</head>
<body bgcolor="#0f3462" style="margin-top:20px;margin-bottom:20px">
  <!-- Main table -->
  <table border="0" align="center" cellspacing="0" cellpadding="0" bgcolor="white" width="650">
    <tr>
      <td>
        <!-- Child table -->
        <table border="0" cellspacing="0" cellpadding="0" style="color:#0f3462; font-family: sans-serif;">
          <tr>
            <td>
              <h2 style="text-align:center; margin: 0px; padding-bottom: 25px; margin-top: 25px;">
                <i>Saraha App</i></h2>
            </td>
          </tr>
          <tr>
            <td>
              <img src="https://image.flaticon.com/icons/svg/149/149314.svg" height="50px" style="display:block; margin:auto;padding-bottom: 25px; ">
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">
              <h1 style="margin: 0px;padding-bottom: 25px; text-transform: uppercase;">verify your email address</h1>
              <h2 style="margin: 0px;padding-bottom: 25px;font-size:22px;"> Please click verify email below to verify your account</h2>
            </td>
          </tr>
          <tr>
           your email address OTP is <b>${otp}</b>
          </tr>
          <tr>
            <td style="text-align:center;">
              <h2 style="padding-top: 25px; line-height: 1; margin:0px;">Need Help?</h2>
              <div style="margin-bottom: 25px; font-size: 15px;margin-top:7px;">Give us a Missed call Sample-1800
              </div>
            </td>
          </tr>
        </table>
        <!-- /Child table -->
      </td>
    </tr>
  </table>
  <!-- / Main table -->
</body>

</html>`;
}
