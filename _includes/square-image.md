{%- capture img_src -%}
  {{ '/assets/img/' | append: include.src | append: "?" }}
{%- endcapture -%}
<img src="{{ img_src | append: site.github.build_revision | relative_url }}" class="w-[{{ include.size }}px]" alt="{{ include.alt }}" />