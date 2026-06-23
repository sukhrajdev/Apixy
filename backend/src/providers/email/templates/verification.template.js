export const template = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verify Your Apixy Account</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:#f4f7fc;
    font-family:Arial, Helvetica, sans-serif;
    padding:30px 15px;
}

.email-wrapper{
    max-width:650px;
    margin:auto;
}

.email-container{
    background:#ffffff;
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,0.08);
}

.header{
    background:linear-gradient(135deg,#4f46e5,#7c3aed);
    padding:50px 20px;
    text-align:center;
}

.logo{
    font-size:38px;
    font-weight:700;
    color:#ffffff;
    letter-spacing:1px;
}

.tagline{
    margin-top:10px;
    color:rgba(255,255,255,0.9);
    font-size:15px;
}

.content{
    padding:45px 35px;
}

.greeting{
    font-size:28px;
    color:#111827;
    margin-bottom:20px;
}

.text{
    color:#4b5563;
    font-size:16px;
    line-height:1.8;
    margin-bottom:20px;
}

.verify-section{
    text-align:center;
    margin:40px 0;
}

.verify-btn{
    display:inline-block;
    text-decoration:none;
    background:#4f46e5;
    color:#ffffff !important;
    padding:16px 40px;
    border-radius:12px;
    font-size:16px;
    font-weight:700;
}

.verify-btn:hover{
    background:#4338ca;
}

.link-container{
    background:#f3f4f6;
    border:1px solid #e5e7eb;
    padding:15px;
    border-radius:10px;
    margin-top:15px;
    word-break:break-all;
    color:#374151;
    font-size:14px;
}

.info-box{
    background:#eef2ff;
    border-left:4px solid #4f46e5;
    padding:15px;
    margin-top:25px;
    border-radius:8px;
}

.info-box p{
    color:#4338ca;
    font-size:14px;
    line-height:1.6;
}

.footer{
    background:#f9fafb;
    padding:25px;
    text-align:center;
    border-top:1px solid #e5e7eb;
}

.footer-text{
    color:#6b7280;
    font-size:14px;
    margin-bottom:8px;
}

.footer-copy{
    color:#9ca3af;
    font-size:13px;
}

@media(max-width:600px){

    .content{
        padding:30px 20px;
    }

    .greeting{
        font-size:24px;
    }

    .logo{
        font-size:32px;
    }

    .verify-btn{
        width:100%;
        display:block;
    }
}
</style>

</head>
<body>

<div class="email-wrapper">

    <div class="email-container">

        <div class="header">
            <div class="logo">Apixy</div>
            <div class="tagline">
                Secure • Reliable • Modern
            </div>
        </div>

        <div class="content">

            <h1 class="greeting">
                Hello, {{username}} 👋
            </h1>

            <p class="text">
                Welcome to Apixy! We're excited to have you join our platform.
            </p>

            <p class="text">
                To activate your account and access all Apixy features,
                please verify your email address by clicking the button below.
            </p>

            <div class="verify-section">
                <a href="{{verificationLink}}" class="verify-btn">
                    Verify My Account
                </a>
            </div>

            <p class="text">
                If the button above doesn't work, copy and paste this link into your browser:
            </p>

            <div class="link-container">
                {{verificationLink}}
            </div>

            <div class="info-box">
                <p>
                    For security reasons, this verification link may expire after a certain period.
                    If you did not create an Apixy account, you can safely ignore this email.
                </p>
            </div>

        </div>

        <div class="footer">
            <div class="footer-text">
                Thank you for choosing Apixy.
            </div>

            <div class="footer-copy">
                © 2026 Apixy. All Rights Reserved.
            </div>
        </div>

    </div>

</div>

</body>
</html>
`


