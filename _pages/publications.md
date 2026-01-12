---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if site.author.googlescholar %}
  <div class="admonition note">
  <p class="admonition-title">Note</p>
  <p>
    You can also find my articles on <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>
  </p>
</div>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% assign is_last = forloop.last %}
  {% include archive-single.html is_last=is_last %}
{% endfor %}
