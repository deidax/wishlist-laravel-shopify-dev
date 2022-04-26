<template>
        <Link
            :href="href"
            class="text-black-500 hover:underline"
            :class="{'font-bold underline' : active }"
        >
            <slot />
        </Link>
</template>

<script>
import { Link } from "@inertiajs/inertia-vue";
export default {
    name: "NavLink",
    components: { Link },
    
    props:{
        active: Boolean,
        href: String
    }
}
</script>

<style>

</style>