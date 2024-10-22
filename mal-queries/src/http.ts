export async function fetchAnime(genreId:number){
    const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=popularity`)
    const resData = await response.json()
    if(!response.ok){
        throw new Error("failed to fetch data")
    }
    return resData
}
export async function fetchAnimeParams(qString:string){
    console.log("getting api on url ", `https://api.jikan.moe/v4/anime?${qString}`)
    const response = await fetch(`https://api.jikan.moe/v4/anime${qString}`)
    const resData = await response.json()
    if(!response.ok){
        throw new Error("failed to fetch data")
    }
    return resData
}

export async function fetchRandomAnime(){
    const response = await fetch("https://api.jikan.moe/v4/random/anime")
    const resData = await response.json()
    if(!response.ok){
        throw new Error("unable to fetch random")
    }
    return resData
}
export async function fetchAnimeById(id:number){
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`)
    const resData = await response.json()
    if(!response.ok){
        throw new Error("unable to fetch by id")
    }
    return resData.data
}