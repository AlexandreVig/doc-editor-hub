const settings = useSettings();

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (await settings.isLogged() === false) {
    return navigateTo("/auth/");
  }
});
