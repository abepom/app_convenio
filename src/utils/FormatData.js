export const formatData = (data) => {
    let dia = data.getDay
    let mes = data.getMonth
    let ano = data.getFullYear
    return `${dia}/${mes}/${ano}`
}