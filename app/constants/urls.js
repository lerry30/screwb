export const serverDomain = 'http://192.168.0.107:3000';

export const urls = {
    signup: `${serverDomain}/api/users`,
    signin: `${serverDomain}/api/users/auth`,
    profileimage: `${serverDomain}/api/users/profileimage`,
    updateprofile: `${serverDomain}/api/users/profile`,
    createpost: `${serverDomain}/api/posts/create`,
    getvideos: `${serverDomain}/api/videos`,
    feedback: `${serverDomain}/feedback`,
    reactions: `${serverDomain}/feedback/user`,
    postreactions: `${serverDomain}/feedback/post`,
}
