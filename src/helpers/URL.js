// parses the hash for paramters
export const changeURL = (params) => {
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString();
    window.history.pushState({path:newurl},'',newurl);
}