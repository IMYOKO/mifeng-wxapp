<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
page {
	height: 100%;
	background: #f1f2f8;
}
.clearfix {
	zoom: 1;
}
.clearfix:after {
	display: block;
	content:  "\200B";
	clear: both;
	height: 0;
}
</style>

