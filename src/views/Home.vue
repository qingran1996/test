<template>
	<div class="home">
		123
		<button @click="goback">点击返回</button>
		<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
	</div>
</template>

<script>
	// @ is an alias to /src
	// import HelloWorld from "@/components/HelloWorld.vue";

	export default {
		name: "Home",
		components: {

		},
		methods: {
			goback() {
				localStorage.removeItem('eleToken')
				this.$router.push(`/`)
				location.reload()
			}
		}
	};
</script>
