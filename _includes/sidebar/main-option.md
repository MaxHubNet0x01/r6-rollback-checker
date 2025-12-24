<ul class="mt-8">
  <li>
    <a href="{{ include.href | relative_url }}"
        data-page-id="{{ include.id }}"
        class="group text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-amber-500 transition-all text-sm flex items-center hover:bg-slate-200 dark:hover:bg-transparent rounded-md px-4 py-3">
      {% if include.icon %}
        {% include {{ include.icon }} class="dark:fill-gray-300 dark:group-hover:fill-amber-500" %}
      {% endif %}
      
      <span>{{ include.text }}</span>
    </a>
  </li>
</ul>