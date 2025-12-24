<section class="bg-white dark:bg-zinc-800 dark:text-gray-300 shadow-md rounded-lg p-6 mb-6">
  <h2 class="text-2xl font-semibold dark:text-gray-300 mb-4">{{ include.heading }}</h2>
  <div class="flex flex-col md:flex-row">
    <div class="w-full md:w-1/2 flex items-center justify-center">
      {% capture img_w %}{{ include.w | default: '50%'}}{% endcapture %}
      {%- capture class_extra -%}
        rounded-2xl border-none shadow-none {{ include.class }}
      {%- endcapture -%}
      {%- include image.md src=include.src w=img_w h="auto" class=class_extra -%}
    </div>
    <div class="w-full md:w-1/2 flex items-center justify-center">
      <p class="mb-4 px-12">{{ include.content }}</p>
    </div>
  </div>
  {% if include.src2 %}
    <div class="flex flex-col md:flex-row">
      <div class="w-full md:w-1/2 flex items-center justify-center">
        {% capture img_w2 %}{{ include.w2 | default: '50%'}}{% endcapture %}
        {%- include image.md src=include.src2 w=img_w2 h="auto" class=class_extra -%}
      </div>
      <div class="w-full md:w-1/2 flex items-center justify-center">
        <p class="mb-4 px-12">{{ include.content2 }}</p>
      </div>
    </div>
  {% endif %}
</section>