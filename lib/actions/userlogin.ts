import  bcrypt from 'bcrypt';
import User from '@/models/usermodel';
export const userLogin = async(formdata : any) => {

    const email = formdata.get('email') as string;
    const password = formdata.get('password') as string;

    const user = await User.findOne({email : email})

    if(!user){
        return {sucess : false, mssg : "user not found"}
    }
    const matchedPassword = await  user.checkpassword(password)
    if(user && matchedPassword ){
        return { userId : user.id, sucess : true , mssg : 'sucessfully matched'}
    }else{
        return {sucess : false, mssg : 'password is wrong'}
    }
}