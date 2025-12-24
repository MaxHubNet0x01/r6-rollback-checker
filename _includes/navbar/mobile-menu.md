<div class="lg:hidden">
  <div>
    <button id="toggleClose" class='hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3'>
      {% include navbar/mobile-menu-toggle-close-icon.md %}
    </button>
  </div>
  <div id="collapseMenu" class='hidden block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50'>
    <ul class='lg:hidden lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50'>
      <li class='mb-6 hidden max-lg:block'>
        <a href="javascript:void(0)"><img src="{{ '/assets/img/logo.png' | relative_url }}" alt="logo"
            class='w-36 shadow-none border-none' />
        </a>
      </li>
      <li class='max-lg:border-b border-gray-300 max-lg:py-3 px-3'>
        <a href='/ddon-fan-wiki' class='text-black block font-semibold text-[15px]'>HomeX</a>
      </li>
    </ul>
  </div>
  <div class="p-5">
    <button id="toggleOpen">
      {% include navbar/mobile-menu-toggle-open-icon.md %}
    </button>
  </div>
</div>