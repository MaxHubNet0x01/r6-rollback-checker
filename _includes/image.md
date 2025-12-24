{%- capture img_src -%}
  {{ '/assets/img/' | append: include.src | append: "?" }}
{%- endcapture -%}

{% if include.alt %}
  <p class="mb-5 font-bold">
    {{ include.alt }}
  </p>
{% endif %}

<img src="{{ img_src | append: site.github.build_revision | relative_url }}" class="w-[{{ include.w }}] h-[{{ include.h }}] {{ include.class }}" alt="{{ include.alt }}" />