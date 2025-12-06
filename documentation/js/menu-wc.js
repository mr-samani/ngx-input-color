'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ngx-input-color documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/NgxInputBoxShadowModule.html" data-type="entity-link" >NgxInputBoxShadowModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-NgxInputBoxShadowModule-02c2f261f6bd0c6e70ab5799d2285bd029736e929ab1ed8c78261cb499a331928ef626418d3ce14544af2b07788e127ea258594d697ffb4756139909022decde"' : 'data-bs-target="#xs-directives-links-module-NgxInputBoxShadowModule-02c2f261f6bd0c6e70ab5799d2285bd029736e929ab1ed8c78261cb499a331928ef626418d3ce14544af2b07788e127ea258594d697ffb4756139909022decde"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-NgxInputBoxShadowModule-02c2f261f6bd0c6e70ab5799d2285bd029736e929ab1ed8c78261cb499a331928ef626418d3ce14544af2b07788e127ea258594d697ffb4756139909022decde"' :
                                        'id="xs-directives-links-module-NgxInputBoxShadowModule-02c2f261f6bd0c6e70ab5799d2285bd029736e929ab1ed8c78261cb499a331928ef626418d3ce14544af2b07788e127ea258594d697ffb4756139909022decde"' }>
                                        <li class="link">
                                            <a href="directives/NgxInputBoxShadowDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgxInputBoxShadowDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NgxInputColorModule.html" data-type="entity-link" >NgxInputColorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' : 'data-bs-target="#xs-components-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' :
                                            'id="xs-components-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' }>
                                            <li class="link">
                                                <a href="components/CmykComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CmykComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HslComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HslComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NgxInputColorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgxInputColorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PickerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PickerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RgbComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RgbComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' : 'data-bs-target="#xs-directives-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' :
                                        'id="xs-directives-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' }>
                                        <li class="link">
                                            <a href="directives/NgxInputColorDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgxInputColorDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' : 'data-bs-target="#xs-pipes-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' :
                                            'id="xs-pipes-links-module-NgxInputColorModule-9ecf8b6293e67c694f4c8536a40fe58e39ffc329e637d052af48d95263fa5803c20e011394f0e40179ba9514c0707bbc7dbbb001ab7a467c9a2fb5ff55a55928"' }>
                                            <li class="link">
                                                <a href="pipes/EnumToArrayPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EnumToArrayPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NgxInputGradientModule.html" data-type="entity-link" >NgxInputGradientModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-NgxInputGradientModule-ff56384ff4e669653f32951f6fa988054d269247c47162f30372ce118ef429f0a02ad21c92c536d5d649ae117e714a9fc1fb65e1762c1b74d687f4c741675ff3"' : 'data-bs-target="#xs-directives-links-module-NgxInputGradientModule-ff56384ff4e669653f32951f6fa988054d269247c47162f30372ce118ef429f0a02ad21c92c536d5d649ae117e714a9fc1fb65e1762c1b74d687f4c741675ff3"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-NgxInputGradientModule-ff56384ff4e669653f32951f6fa988054d269247c47162f30372ce118ef429f0a02ad21c92c536d5d649ae117e714a9fc1fb65e1762c1b74d687f4c741675ff3"' :
                                        'id="xs-directives-links-module-NgxInputGradientModule-ff56384ff4e669653f32951f6fa988054d269247c47162f30372ce118ef429f0a02ad21c92c536d5d649ae117e714a9fc1fb65e1762c1b74d687f4c741675ff3"' }>
                                        <li class="link">
                                            <a href="directives/NgxInputGradientDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgxInputGradientDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NgxBoxShadowComponent.html" data-type="entity-link" >NgxBoxShadowComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NgxInputColorComponent.html" data-type="entity-link" >NgxInputColorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NgxInputGradientComponent.html" data-type="entity-link" >NgxInputGradientComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RangeSliderComponent.html" data-type="entity-link" >RangeSliderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SaturationComponent.html" data-type="entity-link" >SaturationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SliderComponent.html" data-type="entity-link" >SliderComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/NgxInputBoxShadowDirective.html" data-type="entity-link" >NgxInputBoxShadowDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/NgxInputGradientDirective.html" data-type="entity-link" >NgxInputGradientDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CMYK.html" data-type="entity-link" >CMYK</a>
                            </li>
                            <li class="link">
                                <a href="classes/HSL.html" data-type="entity-link" >HSL</a>
                            </li>
                            <li class="link">
                                <a href="classes/HSLA.html" data-type="entity-link" >HSLA</a>
                            </li>
                            <li class="link">
                                <a href="classes/HSV.html" data-type="entity-link" >HSV</a>
                            </li>
                            <li class="link">
                                <a href="classes/HSVA.html" data-type="entity-link" >HSVA</a>
                            </li>
                            <li class="link">
                                <a href="classes/NgxColor.html" data-type="entity-link" >NgxColor</a>
                            </li>
                            <li class="link">
                                <a href="classes/RGB.html" data-type="entity-link" >RGB</a>
                            </li>
                            <li class="link">
                                <a href="classes/RGBA.html" data-type="entity-link" >RGBA</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValueModel.html" data-type="entity-link" >ValueModel</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BoxShadowValue.html" data-type="entity-link" >BoxShadowValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GradientStop.html" data-type="entity-link" >GradientStop</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPosition.html" data-type="entity-link" >IPosition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IValue.html" data-type="entity-link" >IValue</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/EnumToArrayPipe.html" data-type="entity-link" >EnumToArrayPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/EnumToArrayStringValuePipe.html" data-type="entity-link" >EnumToArrayStringValuePipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});