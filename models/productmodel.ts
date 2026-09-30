import { Schema,model,Document,models } from "mongoose";

export interface variantschema extends Document{
    id : string,
    name : string,
    brand : string,
    basePrice : number,
    rating : number,
    stock : boolean,
    performanceScore : number,
    cameraScore ?:  number,
    batterySCore ?: number,
    displaySCore ?: number,
    buildQualitySCore ?: number
    specs : Record<string, string|number>
}

const variantSChema = new Schema<variantschema>({
       id : String,
    name : String,
    brand : String,
    basePrice : Number,
    rating : Number,
    stock : Boolean,
    performanceScore : Number,
    cameraScore :  Number,
    batterySCore : Number,
    displaySCore : Number,
    buildQualitySCore : Number,
    specs: {
  type: Map,
  of: String
}
   //Schema.Types.String 
})


export interface productschema extends Document{
         category : string,
         name : string,
         variants : variantschema[]
}
const ProductSChema =new Schema({
    category:{
        type : String,
        required :[true,'Category is required'],
        enum :{
            values:['smartphone', 'laptop', 'headphone', 'monitor'],
            message : 'category must be either smartphone, monitor, headphone,laptop'      
        }
    },
    name:{
        type : String,
    },

    variants : [variantSChema]
})

const ProductModel = models.products|| model<productschema>('products', ProductSChema);

export default ProductModel;