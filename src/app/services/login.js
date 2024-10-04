const loginService = { authentication, logout };

async function authentication(email, password) {
    
    const data = { email: email, password: password }

    let apiEndPoint = process.env.NEXT_PUBLIC_API_URL+'/login';

    let response = await fetch(apiEndPoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if(response.ok) {
        const res = await response.json();
        return res
    }

    if(response.status == false)
    {
        throw new Error(`HTTP error! status: ${response.msg}`);
    }
}

async function logout(token) {
    
    let apiEndPoint = process.env.NEXT_PUBLIC_API_URL+'/logout';
    const response = await fetch(apiEndPoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return response;
}

export default loginService;