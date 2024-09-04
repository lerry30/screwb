export const serverDomain = 'http://192.168.0.104:3000';

export const urls = {
    signup: `${serverDomain}/api/users`,
    signin: `${serverDomain}/api/users/auth`,
    profileimage: `${serverDomain}/api/users/profileimage`,
    updateprofile: `${serverDomain}/api/users/profile`,
    createpost: `${serverDomain}/api/posts/create`,
    getvideos: `${serverDomain}/api/videos`,
    feedback: `${serverDomain}/api/feedback`,
    reactions: `${serverDomain}/api/feedback/user`,
    postreactions: `${serverDomain}/api/feedback/post`,
    search: `${serverDomain}/api/videos/search`,
}
