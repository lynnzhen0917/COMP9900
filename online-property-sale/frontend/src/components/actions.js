
// modify auction and user table in the database
// use two methods to update the two table in sqlite
// send email and auction id to the backend
const modifyProject = ( id, email, link, uri ) => {
    fetch("http://localhost:5050/"+uri, {
        method: "POST",
        body: JSON.stringify(
            {
                "email": email,
                "id": id,
            }
        ),
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        }).catch(err => console.log(err));

    fetch("http://localhost:5050/"+uri, {
        method: "PUT",
        body: JSON.stringify(
            {
                "email": email,
                "id": id,
            }
        ),
    })
        .then(res => res.json())
        .then(data => {
            if (link) {
                // jump to another page
                window.location.replace(link)
            }
                
            console.log(data)
        }).catch(err => console.log(err));
}

export { modifyProject }