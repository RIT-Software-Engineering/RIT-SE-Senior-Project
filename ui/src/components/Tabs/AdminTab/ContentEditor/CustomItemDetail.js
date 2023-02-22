import PropTypes from 'prop-types';
import React from 'react';
import { config } from '../../../util/functions/constants';

/**
 * Component to overwrite the react-keyed-file-browser library default item detail
 * Allows us to provide the resource link so that Admin user can view file content.
 * Link to default item detail: https://github.com/uptick/react-keyed-file-browser/blob/master/src/details/default.js
 */
class CustomItemDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        file: PropTypes.shape({
            key: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            extension: PropTypes.string.isRequired,
            url: PropTypes.string,
        }).isRequired,
        close: PropTypes.func,
    }

    render() {
        return (
            <div>
                <h2>Item Detail</h2>
                <dl>
                    <h3>File name</h3>
                    <dd>{this.props.file.key}</dd>
                    <h3>Resource link</h3>
                    <dd>
                        <a href={`${config.url.BASE_URL}/resource/${this.props.file.key}`}
                            target="_blank" rel="noreferrer">
                            {config.url.BASE_URL}/resource/{this.props.file.key}
                        </a>
                    </dd>
                </dl>
            </div>
        );
    }
}

export default CustomItemDetail;
