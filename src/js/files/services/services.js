const postData = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: data,
    });

    return await response.json();
};

const getResource = async (url) => {
    const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }
};

export { postData };
export { getResource };
