import axios from "axios";
import { sha256 } from "js-sha256";
import { defineStore } from "pinia";

export const useSettings = defineStore("websiteSettings", {
  state: () => {
    return {
      navbarEnabled: false,
      name: "",
      email: "",
      userId: "",
      userHash: "",
    };
  },
  actions: {
    setNavbar(state: boolean) {
      this.navbarEnabled = state;
    },
    async isLogged() {
      const token = localStorage.getItem('user');
      if (!token) {
        return false;
      }
      try {
        const response = await axios.get(`/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.userId = response.data._id;
        this.email = response.data.email;
        this.name = response.data.name;
        this.userHash = sha256(this.email);
        return true;
      } catch (error) {
        return false;
      }
    },
    async login(email: string, password: string) {
      try {
        const response = await axios.post(`/api/auth/login`, {
          email: email,
          password: password
        })
        localStorage.setItem('user', response.data.token);
        navigateTo('/document');
      } catch (error) {
        throw error;
      }
    },
    async register(name: string, email: string, password: string) {
      try {
        const response = await axios.post(`/api/auth/register`, {
          name: name,
          email: email,
          password: password
        })
        localStorage.setItem('user', response.data.token);
        navigateTo('/document');
      } catch (error) {
        throw error;
      }
    },
    logout() {
      localStorage.removeItem('user');
      navigateTo('/');
    },
    get(url: string) {
      return axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user')}`
        }
      });
    },
    post(url: string, postBody: FormData | Object) {
      return axios.post(url,
        postBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user')}`
          },
        }
      )
    },
    put(url:string, putBody: Object) {
      return axios.put(url,
        putBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user')}`
          },
        }
      )
    },
    delete(url:string) {
      return axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user')}`
        }
      });
    }
  }
});
