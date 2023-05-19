<template>
  <div class="header-component">
    <img
      v-if="false"
      width="69"
      height="69"
      src="https://www.print.com/wp-content/uploads/2022/09/printlogo.svg"
      decoding="async"
      loading="lazy"
    >
    <input class="menu-btn" type="checkbox" id="menu-btn" />
    <label class="menu-icon" for="menu-btn"><span class="navicon"></span></label>
    <ul class="menu">
      <li><nuxt-link :to="{ name: 'users' }">Users</nuxt-link></li>
      <!-- <li><nuxt-link :to="{ name: 'products-flyers' }">Flyers</nuxt-link></li>
      <li><nuxt-link :to="{ name: 'products-businesscards' }">Businesscards</nuxt-link></li> -->
    </ul>
  </div>
</template>

<style lang="scss">
/* body {
  margin: 0;
  font-family: Helvetica, sans-serif;
  background-color: #f4f4f4;
}

a {
  color: #000;
} */

/* header */

.header-component {
  margin: 0;
  font-family: Helvetica, sans-serif;
  background-color: #f4f4f4;

  background-color: #fff;
  box-shadow: 1px 1px 4px 0 rgba(0,0,0,.1);
  position: fixed;
  width: 100%;
  z-index: 3;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: hidden;
    background-color: #fff;

    li a {
      display: block;
      padding: 20px 20px;
      border-right: 1px solid $grayscale_gray-93;
      text-decoration: none;
      color: #000;
    }
  }

  li a:hover,
  .menu-btn:hover {
    background-color: $grayscale_gray-93;
  }

  .logo {
    display: block;
    float: left;
    font-size: 2em;
    padding: 10px 20px;
    text-decoration: none;
  }

  /* menu */

  .menu {
    clear: both;
    max-height: 0;
    transition: max-height .2s ease-out;
  }

  /* menu icon */

  .menu-icon {
    cursor: pointer;
    display: inline-block;
    float: right;
    padding: 28px 20px;
    position: relative;
    user-select: none;
  }

  .menu-icon .navicon {
    background: #333;
    display: block;
    height: 2px;
    position: relative;
    transition: background .2s ease-out;
    width: 18px;
  }

  .menu-icon .navicon:before,
  .menu-icon .navicon:after {
    background: #333;
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    transition: all .2s ease-out;
    width: 100%;
  }

  .menu-icon .navicon:before {
    top: 5px;
  }

  .menu-icon .navicon:after {
    top: -5px;
  }

  /* menu btn */

  .menu-btn {
    display: none;
  }

  .menu-btn:checked ~ .menu {
    max-height: 240px;
  }

  .menu-btn:checked ~ .menu-icon .navicon {
    background: transparent;
  }

  .menu-btn:checked ~ .menu-icon .navicon:before {
    transform: rotate(-45deg);
  }

  .menu-btn:checked ~ .menu-icon .navicon:after {
    transform: rotate(45deg);
  }

  .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:before,
  .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:after {
    top: 0;
  }

  /* 48em = 768px */

  @media (min-width: 48em) {
    li {
      float: left;

      a {
        padding: 20px 30px;
      }
    }

    .menu {
      clear: none;
      float: right;
      max-height: none;
    }

    .menu-icon {
      display: none;
    }
  }
}
</style>
