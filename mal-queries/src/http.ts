export async function fetchAnime(genreId:number){
    const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=popularity`)
    const resData = await response.json()
    if(!response.ok){
        throw new Error("failed to fetch data")
    }
    return resData
}
