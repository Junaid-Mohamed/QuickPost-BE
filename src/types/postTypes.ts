import { User } from "./userTypes"



export type Posts = {
    id : String,
    content: String,
    imageUrl?: String,
    likes?: Number,
    author: User
}