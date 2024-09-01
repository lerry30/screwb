import { create } from 'zustand';

export const zScreen = create(set => ({
    reloadHomeScreen: false,
    reloadProfileScreen: false,

    reloadAllScreens: () => {
        console.log('set to store');
        set({ reloadHomeScreen: true, reloadProfileScreen: true });
    }
}));
