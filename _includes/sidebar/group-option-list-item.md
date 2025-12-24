<li>
  <a href="{{ include.href | relative_url }}" data-page-id="{{ include.id }}_link"
    class="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-amber-500 transition-all text-sm flex items-center hover:bg-slate-100 dark:hover:bg-transparent rounded-md px-4 py-2">
    {% include {{ include.icon }} class=include.icon_class %}
    <span>{{ include.text }}</span>
  </a>
</li>