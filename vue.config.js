module.exports = {
  publicPath: "/",
  css: {
      loaderOptions: {
        
        sass: { 
          prependData: 
          `@import "@/style/_spaces.scss";
           @import "@/style/_colors.scss";
           @import "@/style/_breakpoints.scss";
           @import "@/style/_font.scss";`
       }
    }
  }
};
