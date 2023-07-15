export const todayDate = () => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear();
    const scoreDate = yyyy + '-' + mm + '-' + dd;
    const oddDate = yyyy + mm + dd
    return {scoreDate, oddDate}
}