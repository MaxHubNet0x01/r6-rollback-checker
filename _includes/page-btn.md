{% if include.color %}
  {% assign color = include.color %}
{% elsif page.main_color %}
  {% assign color = page.main_color %}
{% else %}
  {% assign color = 'amber-600' %}
{% endif %}

{% if include.dark_color %}
  {% assign dark_color = include.dark_color %}
{% elsif page.main_dark_color %}
  {% assign dark_color = page.main_dark_color %}
{% else %}
  {% assign dark_color = 'white' %}
{% endif %}

{% if include.href %}
  <a href="{{ include.href | relative_url }}">
{% endif %}
<button class='px-4 py-2 text-sm rounded-md font-bold text-{{ dark_color }} dark:text-{{ dark_color }} hover:text-{{ color }} dark:hover:text-{{ dark_color }} border-2 border-{{ color }} bg-{{ color }} dark:bg-transparent transition-all ease-in-out duration-300 hover:bg-transparent dark:hover:bg-{{ color }}' {{ include.attrs }}>
  {{ include.label }}
</button>
{% if include.href %}
  </a>
{% endif %}