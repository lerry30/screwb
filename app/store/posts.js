import { create } from 'zustand';

export const zPosts = create(set => ({
    data: [],

    setPosts: (posts) => {
        if(typeof posts !== 'array') {
            if(posts.length === 0) {
                return {ok: false, message: 'Post is empty or not type of array'};
            }
        }

        set({ data: posts });
        return {ok: true, message: 'Posts is successfully save'};
    },

    add: (post) => {
        const keys = ['id', 'title', 'description', 'video'];
        for(const key of keys) {
            if(!post[key]) {
                return {ok: false, message: `Post ${key} attribute and value is not defined.`};
            }
        }

        set(state => ({ data: state.data.unshift(post) }));
        return {ok: true, message: 'Post is successfully added'};
    },

    removeAllData: () => set({data: []}),
}));
