const { route } = uni.$u;

export const toHome = () => {
    route({
        type: 'redirect',
        url: '/pages/home/home'
    });
}

export const toDetail = () => {
    route({
        type: 'redirect',
        url: '/pages/detail/index'
    });
}

export const toPages = page => {
    route({
        type: 'redirect',
        url: page
    });
}
