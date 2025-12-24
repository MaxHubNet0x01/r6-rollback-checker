<div class="mt-6 sidebar-group-option-container">
  <input type="checkbox" id="sidebar-group-option-{{ include.id }}" class="sidebar-group-option peer hidden">
  <label for="sidebar-group-option-{{ include.id }}" class="flex cursor-pointer group">
    <h6 class="text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-amber-500 dark:group-hover:underline text-md font-bold px-4 flex-1">{{ include.heading }}</h6>
    {% include chevron-down-icon.svg %}
  </label>