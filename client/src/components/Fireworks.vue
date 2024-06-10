<template>
    <div id="firework1" class="fireworks simple size-3x" aria-hidden="true">
        <span class="spark"></span>
        <span class="spark"></span>
        <span class="spark"></span>
        <span class="spark"></span>
    </div>
    <div id="firework2" class="fireworks simple size-3x" aria-hidden="true">
        <span class="spark"></span>
        <span class="spark"></span>
        <span class="spark"></span>
        <span class="spark"></span>
    </div>
    <div id="firework3" class="fireworks simple size-3x" aria-hidden="true">
        <span class="spark"></span>
        <span class="spark"></span>
        <span class="spark"></span>
        <span class="spark"></span>
    </div>
    <div id="firework4" class="fireworks simple size-3x" aria-hidden="true">
        <span class="spark"></span>
        <span class="spark"></span>
        <span class="spark"></span>
        <span class="spark"></span>
    </div>
</template>

<style scoped>
#firework1 {
    position: absolute;
    top: 30%;
    left: 75%;
}

#firework2 {
    position: absolute;
    top: 30%;
    left: 10%;
    --flatify__firework-animation-delay: 1.8s;
}

#firework3 {
    position: absolute;
    top: 40%;
    left: 30%;
    --flatify__firework-animation-delay: 1.1s;
}

#firework4 {
    position: absolute;
    top: 35%;
    left: 60%;
    --flatify__firework-animation-delay: 2.4s;
}

/* Mobile */
@media (max-width: 576px) {
    #firework1 {
        top: 30%;
        left: 65%;
    }

    #firework2 {
        top: 15%;
        left: 15%;
    }

    #firework3 {
        top: 40%;
        left: 30%;
    }

    #firework4 {
        top: 35%;
        left: 60%;
    }
}
</style>