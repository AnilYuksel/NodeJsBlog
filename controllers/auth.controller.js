const User = require("../models/userModel");
const bcrypt = require('bcrypt')

const getLogin = (req,res,next)=>{
    res.render("auth/login",{
        pageTitle:"Login"
    })
}

const postLogin = async (req,res,next)=>{
    const {userName,password} = req.body

    User.findOne({userName:userName},(err,user)=>{
        if(err){
            console.log(err)
        }
        if(!user){
            return res.redirect("/login")
        }
        bcrypt.compare(password,user.password)
        .then((isMatching)=>{
            if(isMatching){
                req.session.user = user
                req.session.isLoggedIn = true
                return req.session.save((err)=>{
                    if(err){
                        console.log(err)
                    }
                    res.redirect("/")
                })
            }
            res.redirect("/login")
        }).catch((err)=>{
            console.log(err)
        })
    })

}

const getSignUp = (req,res,next)=>{
    res.render("auth/signup",{
        pageTitle:"Signup"
    })
}
const postSignUp = async(req,res,next)=>{
    const {userName,email,password,confirmPassword}=req.body

        await bcrypt.hash(password,12).then((hashedPassword)=>{
            const user = new User({
                userName:userName,
                email:email,
                password:hashedPassword
            })
            return user.save()
        }).then(()=>{
            res.redirect("/login")
        }).catch((err)=>{
            console.log(err)
        })
    
}

const postLogout = (req,res,next)=>{
    req.session.destroy(err => {
        if(err) console.log(err)
        res.redirect('/')
    })
}

module.exports = {
    getLogin,
    postLogin,
    postLogout,
    postSignUp,
    getSignUp
}