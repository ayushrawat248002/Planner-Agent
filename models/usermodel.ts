import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      minlength: 10,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    collection: "User",
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return;
});

userSchema.methods.checkpassword = async function(password : string){
    return bcrypt.compare( password, this.password)
}

const User = models.User || model<UserDocument>("User", userSchema);

export default User;
