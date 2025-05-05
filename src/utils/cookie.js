const setCookie= (res,cookies)=> {
    cookies.forEach(({name,value,options})=>{
        res.cookie(name,value,options)
    })
}
export default setCookie;