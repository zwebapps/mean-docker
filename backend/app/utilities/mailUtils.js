const Nodemailer = require("nodemailer");
const path = require("path");

/**
 * For this example to work, you need to set up a sending domain,
 * and obtain a token that is authorized to send from the domain.
 */

const TOKEN = "<YOUR-TOKEN-HERE>";
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";
const RECIPIENT_EMAIL = "<RECIPIENT@EMAIL.COM>";

const transport = Nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "93259dc5f68f72",
    pass: "b17052dc889d7d"
  }
});

exports.sendEmail = async (emailContent) => {
  const { content, senderEmail, heading } = emailContent;
  const logPath = path.join(__basedir, "public/resources/assets/yfl.jpeg");
  transport
    .sendMail({
      text: heading,
      to: {
        address: "zahoor_ahmed143@hotmail.com",
        name: "zahoor Ahmed"
      },
      from: {
        address: senderEmail,
        name: "YFL Club Admin"
      },
      subject: heading ? heading.toUpperCase() : "CLUB ADMIN REQUEST",
      html: `<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>YFL Email Notification</title>
        <style>
          body {
            margin: 0;
            background: #343434;
            font-family: helvetica;
          }
    
          table {
            border: 0;
            border: none;
            border-spacing: none;
            border-spacing: 0;
            padding: 0;
          }
    
          td {
            padding: 0;
          }
          img {
            width: 478px;
          }
    
          .outer-table {
            width: 600;
          }
    
          .main-gutter {
            width: 20px;
            background: white;
          }
    
          .main-container {
            width: 560px;
          }
    
          .is-white-bg {
            background: #fff;
          }
    
          .is-gold {
            color: #c49859;
          }
    
          .is-gold-bg {
            background-color: #c49859;
          }
    
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          p {
            color: #444;
          }
    
          p {
            line-height: 2;
            letter-spacing: 1px;
            font-weight: 500;
          }
    
          .tiny-text {
            font-size: 11px;
            line-height: 1.6;
          }
    
          img {
            display: block;
            border: 0;
            line-height: 0px;
            font-size: 0px;
            margin: 0;
            padding: 0;
          }
    
          a {
            color: black;
            text-decoration: none;
          }
    
          .footer {
            color: #999;
            font-weight: lighter;
            font-size: 13px;
          }
        </style>
      </head>
    
      <body>
        <center>
          <table width="600">
            <tr>
              <td width="600" bgcolor="white">
                <!-- spacer -->
                <table height="10" width="600" bgcolor="eeeeee">
                  <tr>
                    <td height="10" line-height="10px" width="600"></td>
                  </tr>
                </table>
    
                <!-- spacer -->
                <table height="10" width="600" bgcolor="eeeeee">
                  <tr>
                    <td height="10" line-height="10px" width="600"></td>
                  </tr>
                </table>
    
                <!-- spacer -->
                <table height="80" width="600">
                  <tr>
                    <td height="80" line-height="10px" width="600"></td>
                  </tr>
                </table>
    
                <!-- is card -->
                <table width="600">
                  <tr>
                    <td width="60">&nbsp;</td>
                    <td width="478">
                      <table width="478" style="border: 1px solid #eeeeee">
                        <tr height="15" width="478">
                          <td height="15" width="478">&nbsp;</td>
                        </tr>
												 <tr>
                              <td width="478" mc:edit="section_one_img">
                                <img src="${logPath}" alt="" mc:edit="section_one_img">
                              </td>
                            </tr>
                        <tr>
                          <td width="478">
                            <table width="478">                           
                              <tr>
                                <td width="20">&nbsp;</td>
                                <td
                                  width="438"
                                  align="center"
                                  mc:edit="section_one"
                                >
                                  <h1>${heading}</h1>
                                  <p>${content}</p>
                                </td>
                                <td width="20">&nbsp;</td>
                              </tr>
                              <tr>
                                <td width="20">&nbsp;</td>
                                <td width="438">
                                  <table width="438" align="center">
                                    <tr>
                                      <td height="20">&nbsp;</td>
                                    </tr>
                                  </table>
                                </td>
                                <td width="20">&nbsp;</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr height="35" width="478">
                          <td height="35" width="478">&nbsp;</td>
                        </tr>
                      </table>
                    </td>
                    <td width="60">&nbsp;</td>
                  </tr>
                </table>
    
                <!-- spacer -->
                <table height="80" width="600">
                  <tr>
                    <td height="80" line-height="10px" width="600"></td>
                  </tr>
                </table>
    
                <!-- is card -->
    
                <!-- spacer -->
                <table height="80" width="600">
                  <tr>
                    <td height="80" line-height="10px" width="600"></td>
                  </tr>
                </table>
    
                <table width="600" bgcolor="EEEEEE" class="footer">
                  <tr>
                    <td width="30" bgcolor="EEEEEE"></td>
                    <td width="540" bgcolor="EEEEEE">
                      <table width="540" bgcolor="EEEEEE">
                        <tr height="60">
                          <td width="540" height="60" bgcolor="EEEEEE">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="540" align="center" bgcolor="EEEEEE">
                            Company &copy;
                          </td>
                        </tr>
                        <tr height="10">
                          <td width="540" height="10" bgcolor="EEEEEE">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="540" align="center" bgcolor="EEEEEE">
                            social media
                          </td>
                        </tr>
                        <tr height="10">
                          <td width="540" height="10" bgcolor="EEEEEE">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="540" align="center" bgcolor="EEEEEE">
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Consequuntur repellendus natus atque ratione, et,
                            repellat.
                          </td>
                        </tr>
                        <tr height="10">
                          <td width="540" height="10" bgcolor="EEEEEE">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="540" align="center" bgcolor="EEEEEE">
                            <a href="">Settings</a> &nbsp;|
                            <a href="">Unsubscribe</a>
                          </td>
                        </tr>
                        <tr height="50">
                          <td width="540" height="50" bgcolor="EEEEEE">&nbsp;</td>
                        </tr>
                      </table>
                    </td>
                    <td width="30" bgcolor="EEEEEE"></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html> `,
      attachments: []
    })
    .then((res) => {
      const { response, rejected } = res;
      return {
        response,
        rejected
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        response: "Exceptions in sending email"
      };
    });
};
