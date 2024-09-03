<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';

const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
const cpassword = ref('');
const error = ref([]);

const logoUrl = computed(() => {
    return `../logo.png`;
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) => password.length >= 8;
const doPasswordsMatch = (password, confirmPassword) => password === confirmPassword;

const validateForm = () => {
    error.value = []; // Reset errors at the start

    if (!isValidEmail(email.value)) {
        error.value.push("Please enter a valid email.");
    }
    if (!isValidPassword(password.value)) {
        error.value.push("Password must be at least 8 characters long.");
    }
    if (!doPasswordsMatch(password.value, cpassword.value)) {
        error.value.push("Passwords do not match.");
    }
    return error.value.length === 0; // Form is valid if there are no errors
};

const submitForm = async () => {
    if (validateForm()) {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                }),
        });
        if (response.ok) {
            window.location.href = '/auth/login'; // Redirect on success
            alert("Registration successful!")
        } else {
            // Handle non-OK responses more gracefully
            const errorMessage = await response.text();
            error.value.push(errorMessage); // Display specific error message from the server
        }
        } catch (error) {
            console.error("Error during registration:", error);
            window.location.href = '/auth/error'; // Redirect on error
        }
    }
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Sign up to continue</div>
                    </div>

                    <form action="" method="post">
                        <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-5" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <label for="cpassword" class="block text-900 font-medium text-xl mb-2">Confirm Password</label>
                        <Password id="cpassword" v-model="cpassword" placeholder="Confirm Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between gap-5">
                            <div class="flex align-items-center">
                                <span>Already has an account?</span>
                                <a href="/auth/login" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Log in</a>
                            </div>
                        </div>

                        <div v-if="error.length">
                            <p class="text-red-500 mt-5" v-for="(errorMessage, index) in error" :key="index">{{ errorMessage }}</p>
                        </div>

                        <Button ty @click.prevent="submitForm" label="Sign Up" class="w-full p-3 text-xl mt-5"></Button>
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
