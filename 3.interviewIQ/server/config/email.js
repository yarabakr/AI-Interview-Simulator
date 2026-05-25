import nodemailer  from "nodemailer"

const sendEmail = async (email, link)=>{
    try{
    const transporter = nodemailer.createTransport({
        service:"gmail",
       auth:{
        user: process.env.EMAIL,
        pass:process.env.PASSWORD
       } 
    })

   const info= await transporter.sendMail({
        from:process.env.EMAIL,
        to:email,
        subject:"Activate Account",
        html:`<h3>Click to activate:</h3> <a href="${link}">${link}</a>`
    })
    console.log("Email sent successfully " , info.response)
}catch(error){
    console.log("Email Error", error.message)
    throw error
}
}

export default sendEmail 