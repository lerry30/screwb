import { saveToLocal, getFromLocal } from '@/utils/localStorage';

const saveToken = async (payload) => {
    try {
        const token = payload?.token;
        if(!token) return;
        await saveToLocal('token', token);
    } catch(error) {
        console.log(error);
    }
}

export const sendJSON = async (urlPath, payload) => {
    const token = await getFromLocal('token');
    payload['token'] = token;

    const res = await fetch(urlPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    const resPayload = await res.json();
    // you might get an error saying new Error is error when your urlpath is invalid or wrong
    if(!res?.ok) {
        const message = resPayload?.message || 'Failed to fetch';
        throw new Error(message, { cause: { status: res.status, payload: resPayload } });
    }

    saveToken(resPayload);
    return resPayload;
}

export const sendForm = async (urlPath, form) => {
    const token = await getFromLocal('token');
    form.append('token', token);

    const res = await fetch(urlPath, {
        method: 'POST',
        body: form
    });

    const payload = await res.json();
    if(!res?.ok) {
        const message = payload?.message || 'Failed to fetch';
        throw new Error(message, { cause: { response: res, payload } });
    }

    saveToken(payload);
    return payload;
}

export const getData = async (urlPath) => {
    const res = await fetch(urlPath);

    const payload = await res.json();
    if(!res?.ok) {
        const message = payload?.message || 'No response';
        throw new Error(message, { cause: { response: res, payload } });
    }

    return payload;
}

export const deleteWithJSON = async (urlPath, payload) => {
    const token = await getFromLocal('token');
    payload['token'] = token;

    const res = await fetch(urlPath, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    const resPayload = await res.json();
    // you might get an error saying new Error is error when your urlpath is invalid or wrong
    if(!res?.ok) {
        const message = resPayload?.message || 'Failed to fetch';
        throw new Error(message, { cause: { status: res.status, payload: resPayload } });
    }

    saveToken(resPayload);
    return resPayload;
}

export const sendFormUpdate = async (urlPath, form) => {
    const token = await getFromLocal('token');
    form.append('token', token);

    const res = await fetch(urlPath, {
        method: 'PUT',
        body: form
    });

    const payload = await res.json();
    if(!res?.ok) {
        const message = payload?.message || 'Failed to fetch';
        console.log('Error ', { message });
        throw new Error(message, { cause: { response: res, payload } });
    }

    saveToken(payload);
    return payload;
}
