import { applyPrefix } from '../utils';

const TEMPLATE = `
<table class="${applyPrefix('multi-value-table')}">
  <tbody>
  {{ctx.rows}}
  {% if (!ctx.disabled) {%}
    <tr>
      <td colspan="2">
        <button class="btn btn-primary formio-button-add-another" ref="addButton">
          <i class="{{ctx.iconClass('plus')}}"></i> {{ctx.t(ctx.addAnother, {_userInput: true})}}
        </button>
      </td>
    </tr>
  {%} %}
  </tbody>
</table>
`;

export default TEMPLATE;
