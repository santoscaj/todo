
export const validatePass = (self:any)=> (rule:any, value:any, callback:any) =>{
    if(value==='')
        callback(new Error('Please enter password'))
    else{
        if(self.myForm.passwordCheck!=='')
        self.$refs.myForm.validateField('passwordCheck')
        callback()
    }
}

export const validatePassCheck = (self:any)=>(rule:any, value:any, callback:any) =>{
    if(value==='')
        callback(new Error('Please enter confirmation'))
    else if (value !== self.myForm.password)
        callback(new Error('Passwords do not match'))
    else
        callback()
}

export const validateUnique= (validationArr: string[], field: string)=>(rule:any, value:any, callback:any) =>{
    if(validationArr.includes(value))
        callback(new Error(`${field} already taken`))
    else
        callback()
}

