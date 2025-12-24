{% if include.color %}
  {% assign color = include.color %}
{% elsif page.main_color %}
  {% assign color = page.main_color %}
{% else %}
  {% assign color = 'amber-600' %}
{% endif %}

{%- capture heading_id_attr -%}
  {% if include.id != null %}
    {% assign heading_id = include.id %}
    id="{{ heading_id }}"
  {% endif %}
{%- endcapture -%}

<div class="py-2 {{ include.extra_class }}">
  <h1 class="heading text-3xl font-bold px-2 border-l-2 border-{{ color }} border-solid text-{{ color }} mb-5" {{ heading_id_attr }}>
    {{ include.heading }}
  </h1>
</div>