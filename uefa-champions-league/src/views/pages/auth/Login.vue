<script setup>
import axios from 'axios'; // Import Axios
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';

const email = ref('');
const password = ref('');
const error = ref(''); // To store error messages

// Method to call the login API
const login = async () => {
    try {
        const response = await axios.post('/api/login', {
            email: email.value,
            password: password.value,
        });
        // Assuming the server sends a success message upon successful login
        if (response.data === 'Login successful!') {
            window.location.href = '/'; // Redirect on success
            alert('Login successful!');
        } else {
            alert(response.data); // Show other messages from the server
        }
        error.value = ''; // Reset error message
    } catch (err) {
        if (err.response && err.response.status === 401) {
            error.value = 'Invalid email or password.';
        } else if (err.response && err.response.status === 400) {
            error.value = 'User already logged in.';
        } else {
            alert(err.value); // Show other errors
            window.location.href = '/auth/error'; // Redirect on error
        }
    }
};

const logoUrl = computed(() => {
    return `../logo.png`;
});
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Sign in to continue</div>
                    </div>

                    <form action="" method="post">
                        <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <span>Don't have an account?</span>
                                <a href="/auth/register" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Register now</a>
                            </div>
                        </div>

                        <div v-if="error">
                            <p class="text-red-500 mt-5">{{ error }}</p>
                        </div>
                        <Button @click.prevent="login" label="Sign In" class="w-full p-3 text-xl"></Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
