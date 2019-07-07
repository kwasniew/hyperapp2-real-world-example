import page from "./web_modules/page.js";

const router = (dispatch, {routes}) => {
    const paths = Object.keys(routes);
    paths.forEach(path => {
        const route = routes[path];
        page(path, context => {
            dispatch(route, context.params);
        });
    });

    // prevent infinite loop on application startup
    setTimeout(() => {page.start()}, 0);

    return () => {
        page.stop();
    };
};

export const RoutePages = ({routes}) => [router, {routes}];
