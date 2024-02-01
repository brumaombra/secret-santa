<script setup>
import WOW from '/node_modules/wow.js/src/WOW.js';
import { getTranslation } from '@/utils/utils';
new WOW().init(); // Inizializzo WOW.js
</script>

<template>
    <div id="homeView">
        <!-- Intestazione -->
        <header class="header">
            <h1>{{ getTranslation("home.header.title") }}</h1>
            <p>{{ getTranslation("home.header.description") }}</p>
            <img src="/img/people_top.png" class="header-image wow fadeIn">
        </header>

        <!-- Features -->
        <section class="features">
            <!-- Random -->
            <div class="feature">
                <div class="left">
                    <div class="text-content">
                        <h2>{{ getTranslation("home.features.random.title") }}</h2>
                        <p>{{ getTranslation("home.features.random.description") }}</p>
                        <RouterLink to="/draw/step1"><button class="button custom-red-style">{{ getTranslation("home.features.random.button") }}</button></RouterLink>
                    </div>
                </div>
                <div class="right">
                    <img src="/img/wheel_of_fortune.png" class="image wow fadeIn" />
                </div>
            </div>
            <div class="separator"></div>

            <!-- Email -->
            <div class="feature">
                <div class="left">
                    <img src="/img/mail.png" class="image wow fadeIn" />
                </div>
                <div class="right">
                    <div class="text-content">
                        <h2>{{ getTranslation("home.features.email.title") }}</h2>
                        <p>{{ getTranslation("home.features.email.description") }}</p>
                        <RouterLink to="/draw/step1"><button class="button custom-red-style">{{ getTranslation("home.features.email.button") }}</button></RouterLink>
                    </div>
                </div>
            </div>
            <div class="separator spacing-mobile"></div>

            <!-- Random -->
            <div class="feature">
                <div class="left">
                    <div class="text-content">
                        <h2>{{ getTranslation("home.features.possibilities.title") }}</h2>
                        <p>{{ getTranslation("home.features.possibilities.description") }}</p>
                        <RouterLink to="/draw/step1"><button class="button custom-red-style">{{ getTranslation("home.features.possibilities.button") }}</button></RouterLink>
                    </div>
                </div>
                <div class="right">
                    <img src="/img/tree.png" class="image wow fadeIn" />
                </div>
            </div>
            <div class="separator"></div>

            <!-- Email -->
            <div class="feature">
                <div class="left">
                    <img src="/img/people.png" class="image wow fadeIn" />
                </div>
                <div class="right">
                    <div class="text-content">
                        <h2>{{ getTranslation("home.features.gifts.title") }}</h2>
                        <p>{{ getTranslation("home.features.gifts.description") }}</p>
                        <RouterLink to="/draw/step1"><button class="button custom-red-style">{{ getTranslation("home.features.gifts.button") }}</button></RouterLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Call to Action -->
        <section class="call-to-action">
            <h2>{{ getTranslation("home.callToAction.title") }}</h2>
            <p>{{ getTranslation("home.callToAction.description") }}<br />{{ getTranslation("home.callToAction.description.2") }}</p>
            <RouterLink to="/draw/step1"><button class="button custom-red-style">{{ getTranslation("home.callToAction.button") }}</button></RouterLink>
            <img src="/img/santa_presents.png" class="call-to-action-image wow fadeIn">
        </section>
    </div>
</template>

<style scoped>
p {
    color: #666666;
}

#homeView {
    padding-left: 1rem;
    padding-right: 1rem;
}

.button {
    width: 10rem;
}

/* Header */
.header {
    text-align: center;
    padding: 20px 0;
}

.header h1 {
    margin-bottom: 20px;
    font-weight: 900;
}

.header .header-image {
    border-radius: 80px;
    margin-top: 30px;
}

/* Sezione Caratteristiche */
.feature {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    padding-left: 10rem;
    padding-right: 10rem;
}

.feature .left,
.feature .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.feature .right {
    text-align: end;
}

.feature .right img {
    margin-left: auto;
}

.feature h2 {
    margin-bottom: 15px;
    font-weight: 800;
}

.feature p {
    margin-bottom: 20px;
}

.feature .image {
    width: 400px;
}

.separator {
    height: var(--flatify__border-width);
    background-color: #F1F4F7;
    margin-left: 3rem;
    margin-right: 3rem;
    border-radius: 2px;
}

/* Call to Action */
.call-to-action {
    text-align: center;
    padding: 20px 0;
}

.call-to-action h2 {
    margin-bottom: 15px;
    font-weight: 800;
}

.call-to-action p {
    margin-bottom: 15px;
}

.call-to-action .call-to-action-image {
    border-radius: 80px;
    margin-top: 30px;
}

/* Medium */
@media (max-width: 992px) {
    p {
        font-weight: 600;
    }

    .feature {
        display: block;
        padding-left: 0;
        padding-right: 0;
    }

    .feature .image {
        height: auto;
        width: 400px;
        margin-top: 1rem;
        margin-bottom: 1rem;
        margin: auto;
    }

    .feature .text-content {
        text-align: center;
    }

    .header .header-image {
        border-radius: 20px;
    }

    .call-to-action .call-to-action-image {
        border-radius: 20px;
    }

    .separator.spacing-mobile {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
}

/* Mobile */
@media (max-width: 576px) {
    .feature .image {
        height: auto;
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
}
</style>